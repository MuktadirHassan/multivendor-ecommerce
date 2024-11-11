import { OrderItem } from "@prisma/client";
import { BaseRepository } from "../types/repository";

export interface IOrderItemRepository extends BaseRepository<OrderItem> {
  findByOrder(orderId: number): Promise<OrderItem[]>;
  findByProduct(productId: number): Promise<OrderItem[]>;
  updateQuantity(itemId: number, quantity: number): Promise<OrderItem>;
}
