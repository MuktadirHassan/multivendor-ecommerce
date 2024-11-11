import { Order, OrderItem, OrderStatus, PaymentStatus } from "@prisma/client";
import { BaseRepository } from "../types/repository";

export interface IOrderRepository extends BaseRepository<Order> {
  findByUser(userId: number): Promise<Order[]>;
  findByShop(shopId: number): Promise<Order[]>;
  findBySeller(sellerId: number): Promise<Order[]>;
  updateStatus(orderId: number, status: OrderStatus): Promise<Order>;
  updatePaymentStatus(orderId: number, status: PaymentStatus): Promise<Order>;
  findWithItems(orderId: number): Promise<Order & { items: OrderItem[] }>;
  findByDateRange(startDate: Date, endDate: Date): Promise<Order[]>;
}
