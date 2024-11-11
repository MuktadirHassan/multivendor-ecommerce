import { Product } from "@prisma/client";
import { BaseRepository } from "../types/repository";
import { ProductFilters } from "../types/filters";

export interface IProductRepository extends BaseRepository<Product> {
  findByShop(shopId: number): Promise<Product[]>;
  findBySeller(sellerId: number): Promise<Product[]>;
  findByCategory(categoryId: number): Promise<Product[]>;
  updateStock(productId: number, quantity: number): Promise<Product>;
  findFeatured(): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;
  findWithFilters(filters: ProductFilters): Promise<Product[]>;
  updateRating(productId: number): Promise<Product>;
}
