import { Category } from "@prisma/client";
import { BaseRepository } from "../types/repository";

export interface ICategoryRepository extends BaseRepository<Category> {
  findByParentId(parentId: number): Promise<Category[]>;
  findRootCategories(): Promise<Category[]>;
  findWithSubcategories(categoryId: number): Promise<Category>;
  findBySlug(slug: string): Promise<Category | null>;
}
