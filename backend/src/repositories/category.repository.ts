import { BaseRepository } from "../types/repository";
import { PrismaClient, Category, Prisma } from "@prisma/client";
import {
  NotFoundError,
  ValidationError,
  DatabaseError,
} from "../utils/appError";

export interface ICategoryRepository extends BaseRepository<Category> {
  findByParentId(parentId: number): Promise<Category[]>;
  findRootCategories(): Promise<Category[]>;
  findWithSubcategories(categoryId: number): Promise<Category>;
}

export class CategoryRepository implements ICategoryRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: number): Promise<Category | null> {
    try {
      return await this.prisma.category.findUnique({
        where: { id },
        include: {
          children: true,
          products: {
            select: {
              id: true,
              name: true,
              price: true,
              images: true,
              rating: true,
            },
          },
        },
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async findAll(): Promise<Category[]> {
    try {
      return await this.prisma.category.findMany({
        include: {
          children: true,
        },
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async create(
    data: Omit<Category, "id" | "createdAt" | "updatedAt">
  ): Promise<Category> {
    try {
      if (data.parentId) {
        const parentExists = await this.prisma.category.findUnique({
          where: { id: data.parentId },
        });
        if (!parentExists) {
          throw new ValidationError("Parent category not found");
        }
      }

      return await this.prisma.category.create({
        data,
        include: {
          children: true,
        },
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async update(id: number, data: Partial<Category>): Promise<Category> {
    try {
      const existingCategory = await this.findById(id);
      if (!existingCategory) {
        throw new NotFoundError("Category not found");
      }

      if (data.parentId) {
        // Prevent circular references
        if (data.parentId === id) {
          throw new ValidationError("Category cannot be its own parent");
        }

        // Check if new parent exists
        const parentExists = await this.prisma.category.findUnique({
          where: { id: data.parentId },
        });
        if (!parentExists) {
          throw new ValidationError("Parent category not found");
        }
      }

      return await this.prisma.category.update({
        where: { id },
        data,
        include: {
          children: true,
        },
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      // Check for subcategories
      const hasSubcategories = await this.prisma.category.findFirst({
        where: { parentId: id },
      });

      if (hasSubcategories) {
        throw new ValidationError("Cannot delete category with subcategories");
      }

      // Check for associated products
      const hasProducts = await this.prisma.product.findFirst({
        where: { categoryId: id },
      });

      if (hasProducts) {
        throw new ValidationError(
          "Cannot delete category with associated products"
        );
      }

      await this.prisma.category.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async findByParentId(parentId: number): Promise<Category[]> {
    try {
      return await this.prisma.category.findMany({
        where: { parentId },
        include: {
          children: true,
        },
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async findRootCategories(): Promise<Category[]> {
    try {
      return await this.prisma.category.findMany({
        where: { parentId: null },
        include: {
          children: true,
        },
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async findWithSubcategories(categoryId: number): Promise<Category> {
    try {
      const category = await this.prisma.category.findUnique({
        where: { id: categoryId },
        include: {
          children: {
            include: {
              children: true,
            },
          },
        },
      });

      if (!category) {
        throw new NotFoundError("Category not found");
      }

      return category;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2002":
          throw new ValidationError("Category with this name already exists");
        case "P2025":
          throw new NotFoundError("Category not found");
        default:
          throw new DatabaseError(`Database error: ${error.message}`);
      }
    }

    if (error instanceof ValidationError || error instanceof NotFoundError) {
      throw error;
    }

    throw new DatabaseError("Internal database error");
  }
}
