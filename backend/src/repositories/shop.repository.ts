import { BaseRepository } from "../types/repository";
import { PrismaClient, Shop, Prisma } from "@prisma/client";
import {
  NotFoundError,
  ValidationError,
  DatabaseError,
} from "../utils/appError";
import { ShopFilters } from "../types/filters";

export interface IShopRepository extends BaseRepository<Shop> {
  findByUserId(userId: number): Promise<Shop | null>;
  findVerifiedShops(): Promise<Shop[]>;
  updateRating(shopId: number): Promise<Shop>;
  findTopRatedShops(limit: number): Promise<Shop[]>;
  verifyShop(shopId: number): Promise<Shop>;
}

export class ShopRepository implements IShopRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: number): Promise<Shop | null> {
    try {
      return await this.prisma.shop.findUnique({
        where: { id },
        include: {
          seller: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          products: {
            take: 5,
            orderBy: { createdAt: "desc" },
          },
          reviews: {
            take: 3,
            orderBy: { createdAt: "desc" },
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  avatar: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async findAll(params?: Partial<ShopFilters>): Promise<Shop[]> {
    try {
      const { page = 1, limit = 10, rating, isVerified } = params || {};
      const skip = (page - 1) * limit;

      const where: Prisma.ShopWhereInput = {
        ...(rating && { rating: { gte: rating } }),
        ...(typeof isVerified === "boolean" && { isVerified }),
      };

      const [shops, total] = await Promise.all([
        this.prisma.shop.findMany({
          where,
          include: {
            seller: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          skip,
          take: limit,
          orderBy: { rating: "desc" },
        }),
        this.prisma.shop.count({ where }),
      ]);

      // Add pagination metadata
      Object.defineProperty(shops, "metadata", {
        enumerable: true,
        value: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          hasNextPage: skip + limit < total,
          hasPrevPage: page > 1,
        },
      });

      return shops;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async create(data: Omit<Shop, "id" | "rating">): Promise<Shop> {
    try {
      // Check if seller already has a shop
      const existingShop = await this.findByUserId(data.sellerId);
      if (existingShop) {
        throw new ValidationError("Seller already has a shop");
      }

      return await this.prisma.shop.create({
        data: {
          ...data,
          rating: 0,
        },
        include: {
          seller: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async update(id: number, data: Partial<Shop>): Promise<Shop> {
    try {
      const existingShop = await this.findById(id);
      if (!existingShop) {
        throw new NotFoundError("Shop not found");
      }

      return await this.prisma.shop.update({
        where: { id },
        data,
        include: {
          seller: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.prisma.shop.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new NotFoundError("Shop not found");
        }
      }
      throw this.handleError(error);
    }
  }

  async findByUserId(userId: number): Promise<Shop | null> {
    try {
      return await this.prisma.shop.findUnique({
        where: { sellerId: userId },
        include: {
          seller: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async findVerifiedShops(): Promise<Shop[]> {
    try {
      return await this.prisma.shop.findMany({
        where: { isVerified: true },
        orderBy: { rating: "desc" },
        include: {
          seller: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateRating(shopId: number): Promise<Shop> {
    try {
      // Calculate average rating from reviews
      const reviews = await this.prisma.review.findMany({
        where: { shopId },
      });

      const averageRating =
        reviews.length > 0
          ? reviews.reduce((acc, review) => acc + review.rating, 0) /
            reviews.length
          : 0;

      return await this.prisma.shop.update({
        where: { id: shopId },
        data: { rating: averageRating },
        include: {
          seller: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async findTopRatedShops(limit: number): Promise<Shop[]> {
    try {
      return await this.prisma.shop.findMany({
        where: { isVerified: true },
        orderBy: { rating: "desc" },
        take: limit,
        include: {
          seller: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async verifyShop(shopId: number): Promise<Shop> {
    try {
      return await this.prisma.shop.update({
        where: { id: shopId },
        data: { isVerified: true },
        include: {
          seller: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new NotFoundError("Shop not found");
        }
      }
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2002":
          throw new ValidationError("Unique constraint violation");
        case "P2014":
          throw new ValidationError("Invalid ID");
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
