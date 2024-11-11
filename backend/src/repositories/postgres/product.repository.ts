import { PrismaClient, Product, Prisma } from "@prisma/client";
import { IProductRepository } from "../product.repository";
import { ProductFilters } from "../../types/filters";
import {
  NotFoundError,
  ValidationError,
  DatabaseError,
} from "../../utils/appError";

export class ProductRepository implements IProductRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: number): Promise<Product | null> {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id },
        include: {
          category: true,
          shop: true,
          reviews: {
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

      return product;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async findAll(params?: Partial<ProductFilters>): Promise<Product[]> {
    try {
      const { page = 1, limit = 10, ...filters } = params || {};
      const skip = (page - 1) * limit;

      return await this.prisma.product.findMany({
        where: this.buildWhereClause(filters),
        include: {
          category: true,
          shop: true,
        },
        orderBy: this.buildOrderByClause(filters),
        skip,
        take: limit,
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async create(data: Omit<Product, "id">): Promise<Product> {
    try {
      // Validate shop ownership
      const shop = await this.prisma.shop.findFirst({
        where: {
          id: data.shopId,
          sellerId: data.sellerId,
        },
      });

      if (!shop) {
        throw new ValidationError("Invalid shop or seller ID");
      }

      return await this.prisma.product.create({
        data,
        include: {
          category: true,
          shop: true,
        },
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async update(id: number, data: Partial<Product>): Promise<Product> {
    try {
      const existingProduct = await this.findById(id);

      if (!existingProduct) {
        throw new NotFoundError("Product not found");
      }

      // Ensure seller can only update their own products
      if (data.sellerId && data.sellerId !== existingProduct.sellerId) {
        throw new ValidationError("Unauthorized to update this product");
      }

      return await this.prisma.product.update({
        where: { id },
        data,
        include: {
          category: true,
          shop: true,
        },
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.prisma.product.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new NotFoundError("Product not found");
        }
      }
      throw this.handleError(error);
    }
  }

  async findByShop(shopId: number): Promise<Product[]> {
    try {
      return await this.prisma.product.findMany({
        where: { shopId },
        include: {
          category: true,
          reviews: true,
        },
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async findBySeller(sellerId: number): Promise<Product[]> {
    try {
      return await this.prisma.product.findMany({
        where: { sellerId },
        include: {
          category: true,
          shop: true,
        },
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async findByCategory(categoryId: number): Promise<Product[]> {
    try {
      // Get all subcategories
      const subcategories = await this.prisma.category.findMany({
        where: {
          OR: [{ id: categoryId }, { parentId: categoryId }],
        },
        select: { id: true },
      });

      const categoryIds = subcategories.map((cat) => cat.id);

      return await this.prisma.product.findMany({
        where: {
          categoryId: {
            in: categoryIds,
          },
        },
        include: {
          category: true,
          shop: true,
        },
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateStock(productId: number, quantity: number): Promise<Product> {
    try {
      const product = await this.findById(productId);

      if (!product) {
        throw new NotFoundError("Product not found");
      }

      if (product.stock + quantity < 0) {
        throw new ValidationError("Insufficient stock");
      }

      return await this.prisma.product.update({
        where: { id: productId },
        data: {
          stock: {
            increment: quantity,
          },
        },
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async findFeatured(): Promise<Product[]> {
    try {
      return await this.prisma.product.findMany({
        where: {
          isActive: true,
          stock: { gt: 0 },
          rating: { gte: 4 },
        },
        orderBy: {
          rating: "desc",
        },
        take: 10,
        include: {
          category: true,
          shop: true,
        },
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async searchProducts(query: string): Promise<Product[]> {
    try {
      return await this.prisma.product.findMany({
        where: {
          OR: [
            {
              name: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              description: {
                contains: query,
                mode: "insensitive",
              },
            },
          ],
          isActive: true,
        },
        include: {
          category: true,
          shop: true,
        },
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateRating(productId: number): Promise<Product> {
    try {
      // Calculate average rating from reviews
      const reviews = await this.prisma.review.findMany({
        where: { productId },
      });

      const averageRating =
        reviews.length > 0
          ? reviews.reduce((acc, review) => acc + review.rating, 0) /
            reviews.length
          : 0;

      return await this.prisma.product.update({
        where: { id: productId },
        data: {
          rating: averageRating,
        },
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }
  async findWithFilters(filters: ProductFilters): Promise<Product[]> {
    try {
      const {
        page = 1,
        limit = 10,
        categoryId,
        minPrice,
        maxPrice,
        shopId,
        searchQuery,
        inStock,
        rating,
        sortBy,
        sortOrder,
      } = filters;

      const skip = (page - 1) * limit;

      // Build the where clause for filtering
      const where: Prisma.ProductWhereInput = {
        isActive: true,
        ...(categoryId && { categoryId }),
        ...(shopId && { shopId }),
        ...(inStock && { stock: { gt: 0 } }),
        ...(rating && { rating: { gte: rating } }),
        ...((minPrice || maxPrice) && {
          price: {
            ...(minPrice && { gte: minPrice }),
            ...(maxPrice && { lte: maxPrice }),
          },
        }),
        ...(searchQuery && {
          OR: [
            { name: { contains: searchQuery, mode: "insensitive" } },
            { description: { contains: searchQuery, mode: "insensitive" } },
          ],
        }),
      };

      // Build the orderBy clause for sorting
      const orderBy: Prisma.ProductOrderByWithRelationInput = sortBy
        ? { [sortBy]: sortOrder || "desc" }
        : { createdAt: "desc" };

      // Execute the query with includes
      const [products, total] = await Promise.all([
        this.prisma.product.findMany({
          where,
          include: {
            category: true,
            shop: {
              select: {
                id: true,
                name: true,
                rating: true,
                isVerified: true,
              },
            },
            reviews: {
              take: 3,
              orderBy: { createdAt: "desc" },
              select: {
                id: true,
                rating: true,
                comment: true,
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
          orderBy,
          skip,
          take: limit,
        }),
        this.prisma.product.count({ where }),
      ]);

      // Add pagination metadata to the response
      Object.defineProperty(products, "metadata", {
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

      return products;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case "P2025":
            throw new NotFoundError("Related records not found");
          default:
            throw new DatabaseError(`Database error: ${error.message}`);
        }
      }
      throw this.handleError(error);
    }
  }

  // Helper method for pagination metadata
  private getPaginationMetadata(total: number, page: number, limit: number) {
    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: (page - 1) * limit + limit < total,
      hasPrevPage: page > 1,
    };
  }

  private buildWhereClause(
    filters: Partial<ProductFilters>
  ): Prisma.ProductWhereInput {
    const where: Prisma.ProductWhereInput = {
      isActive: true,
    };

    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters.shopId) {
      where.shopId = filters.shopId;
    }

    if (filters.minPrice || filters.maxPrice) {
      where.price = {};
      if (filters.minPrice) where.price.gte = filters.minPrice;
      if (filters.maxPrice) where.price.lte = filters.maxPrice;
    }

    if (filters.searchQuery) {
      where.OR = [
        { name: { contains: filters.searchQuery, mode: "insensitive" } },
        { description: { contains: filters.searchQuery, mode: "insensitive" } },
      ];
    }

    if (filters.inStock) {
      where.stock = { gt: 0 };
    }

    if (filters.rating) {
      where.rating = { gte: filters.rating };
    }

    return where;
  }

  private buildOrderByClause(
    filters: Partial<ProductFilters>
  ): Prisma.ProductOrderByWithRelationInput {
    if (!filters.sortBy) {
      return { createdAt: "desc" };
    }

    return {
      [filters.sortBy]: filters.sortOrder || "desc",
    };
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
          throw new Error("Database error");
      }
    }

    if (error instanceof ValidationError || error instanceof NotFoundError) {
      throw error;
    }

    throw new Error("Internal server error");
  }
}
