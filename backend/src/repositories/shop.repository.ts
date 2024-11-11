import { Shop } from "@prisma/client";
import { BaseRepository } from "../types/repository";

export interface IShopRepository extends BaseRepository<Shop> {
  findByUserId(userId: number): Promise<Shop | null>;
  findVerifiedShops(): Promise<Shop[]>;
  updateRating(shopId: number): Promise<Shop>;
  findTopRatedShops(limit: number): Promise<Shop[]>;
  verifyShop(shopId: number): Promise<Shop>;
}
