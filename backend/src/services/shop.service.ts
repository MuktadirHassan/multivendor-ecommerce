import { Shop, Role } from "@prisma/client";
import { IShopRepository } from "../repositories/shop.repository";
import { IUserRepository } from "../repositories/user.repository";
import { EventEmitter } from "../utils/eventEmitter";
import { uploadImage, deleteImage } from "../utils/imageUpload";
import { NotFoundError, AuthorizationError } from "../utils/appError";
import { ShopFilters } from "../types/filters";

export interface CreateShopDTO {
  name: string;
  description: string;
  sellerId: number;
  logo?: Express.Multer.File;
  banner?: Express.Multer.File;
}

export interface UpdateShopDTO {
  name?: string;
  description?: string;
  logo?: Express.Multer.File;
  banner?: Express.Multer.File;
}

export class ShopService {
  private eventEmitter: EventEmitter;

  constructor(
    private shopRepository: IShopRepository,
    private userRepository: IUserRepository
  ) {
    this.eventEmitter = EventEmitter.getInstance();
  }

  async createShop(data: CreateShopDTO): Promise<Shop> {
    const seller = await this.userRepository.findById(data.sellerId);
    if (!seller) throw new NotFoundError("Seller not found");

    const shopData: any = {
      name: data.name,
      description: data.description,
      sellerId: data.sellerId,
    };

    if (data.logo) {
      shopData.logo = await uploadImage(data.logo);
    }
    if (data.banner) {
      shopData.banner = await uploadImage(data.banner);
    }

    const shop = await this.shopRepository.create(shopData);
    await this.userRepository.updateRole(data.sellerId, Role.SELLER);

    this.eventEmitter.emit("shop.created", shop);
    return shop;
  }

  async updateShop(
    id: number,
    userId: number,
    data: UpdateShopDTO
  ): Promise<Shop> {
    const shop = await this.verifyShopOwnership(id, userId);

    const updateData: any = { ...data };

    if (data.logo) {
      if (shop.logo) await deleteImage(shop.logo);
      updateData.logo = await uploadImage(data.logo);
    }
    if (data.banner) {
      if (shop.banner) await deleteImage(shop.banner);
      updateData.banner = await uploadImage(data.banner);
    }

    const updatedShop = await this.shopRepository.update(id, updateData);
    this.eventEmitter.emit("shop.updated", updatedShop);
    return updatedShop;
  }

  async verifyShop(id: number, adminId: number): Promise<Shop> {
    const admin = await this.userRepository.findById(adminId);
    if (admin?.role !== Role.ADMIN) {
      throw new AuthorizationError("Only admins can verify shops");
    }

    const shop = await this.shopRepository.verifyShop(id);
    this.eventEmitter.emit("shop.verified", shop);
    return shop;
  }

  async deleteShop(id: number, userId: number): Promise<boolean> {
    const shop = await this.verifyShopOwnership(id, userId);

    if (shop.logo) await deleteImage(shop.logo);
    if (shop.banner) await deleteImage(shop.banner);

    await this.shopRepository.delete(id);
    await this.userRepository.updateRole(userId, Role.USER);

    this.eventEmitter.emit("shop.deleted", id);
    return true;
  }

  async getShop(id: number): Promise<Shop> {
    const shop = await this.shopRepository.findById(id);
    if (!shop) throw new NotFoundError("Shop not found");
    return shop;
  }

  async getShops(filters: ShopFilters): Promise<Shop[]> {
    return this.shopRepository.findAll(filters);
  }

  async getTopShops(limit: number = 10): Promise<Shop[]> {
    return this.shopRepository.findTopRatedShops(limit);
  }

  private async verifyShopOwnership(
    shopId: number,
    userId: number
  ): Promise<Shop> {
    const shop = await this.shopRepository.findById(shopId);
    if (!shop) throw new NotFoundError("Shop not found");
    if (shop.sellerId !== userId) {
      throw new AuthorizationError(
        "You don't have permission to modify this shop"
      );
    }
    return shop;
  }
}
