import { Order, OrderStatus, PaymentStatus } from "@prisma/client";
import { IOrderRepository } from "../repositories/order.repository";
import { IProductRepository } from "../repositories/product.repository";
import { NotFoundError, ValidationError } from "../utils/appError";
import { EventEmitter } from "../utils/eventEmitter";

export interface CreateOrderDTO {
  userId: number;
  addressId: number;
  items: {
    productId: number;
    quantity: number;
  }[];
  paymentMethod: string;
}

export class OrderService {
  private eventEmitter: EventEmitter;

  constructor(
    private orderRepository: IOrderRepository,
    private productRepository: IProductRepository
  ) {
    this.eventEmitter = EventEmitter.getInstance();
  }

  async createOrder(data: CreateOrderDTO): Promise<Order> {
    const total = await this.calculateOrderTotal(data.items);
    const order = await this.orderRepository.create({
      userId: data.userId,
      addressId: data.addressId,
      total,
      paymentMethod: data.paymentMethod,
      status: OrderStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
    } as Order);

    await this.createOrderItems(order.id, data.items);
    await this.updateProductStock(data.items);

    this.eventEmitter.emit("orderCreated", order);
    return this.orderRepository.findWithItems(order.id);
  }

  async getOrderById(id: number): Promise<Order> {
    const order = await this.orderRepository.findById(id);
    if (!order) throw new NotFoundError("Order not found");
    return order;
  }

  async getUserOrders(userId: number): Promise<Order[]> {
    return this.orderRepository.findByUser(userId);
  }

  async getShopOrders(shopId: number): Promise<Order[]> {
    return this.orderRepository.findByShop(shopId);
  }

  async updateOrderStatus(
    orderId: number,
    status: OrderStatus
  ): Promise<Order> {
    const order = await this.getOrderById(orderId);
    const updatedOrder = await this.orderRepository.updateStatus(
      orderId,
      status
    );
    this.eventEmitter.emit("orderStatusUpdated", updatedOrder);
    return updatedOrder;
  }

  async updatePaymentStatus(
    orderId: number,
    status: PaymentStatus
  ): Promise<Order> {
    const order = await this.getOrderById(orderId);
    const updatedOrder = await this.orderRepository.updatePaymentStatus(
      orderId,
      status
    );
    this.eventEmitter.emit("orderPaymentStatusUpdated", updatedOrder);
    return updatedOrder;
  }

  async getOrdersByDateRange(startDate: Date, endDate: Date): Promise<Order[]> {
    return this.orderRepository.findByDateRange(startDate, endDate);
  }

  private async calculateOrderTotal(
    items: { productId: number; quantity: number }[]
  ): Promise<number> {
    let total = 0;
    for (const item of items) {
      const product = await this.productRepository.findById(item.productId);
      if (!product)
        throw new NotFoundError(`Product ${item.productId} not found`);
      if (product.stock < item.quantity) {
        throw new ValidationError(
          `Insufficient stock for product ${product.name}`
        );
      }
      total += product.price * item.quantity;
    }
    return total;
  }

  private async createOrderItems(
    orderId: number,
    items: { productId: number; quantity: number }[]
  ) {
    for (const item of items) {
      const product = await this.productRepository.findById(item.productId);
      if (!product)
        throw new NotFoundError(`Product ${item.productId} not found`);

      await this.orderRepository.create({
        orderId,
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      } as any);
    }
  }

  private async updateProductStock(
    items: { productId: number; quantity: number }[]
  ) {
    for (const item of items) {
      await this.productRepository.updateStock(item.productId, -item.quantity);
    }
  }
}
