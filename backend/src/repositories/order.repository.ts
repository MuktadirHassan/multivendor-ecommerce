import { BaseRepository } from "../types/repository";
import {
  Order,
  OrderStatus,
  PaymentStatus,
  Prisma,
  PrismaClient,
} from "@prisma/client";
import {
  NotFoundError,
  ValidationError,
  DatabaseError,
} from "../utils/appError";

export interface IOrderRepository extends BaseRepository<Order> {
  findByUser(userId: number): Promise<Order[]>;
  findByShop(shopId: number): Promise<Order[]>;
  findBySeller(sellerId: number): Promise<Order[]>;
  updateStatus(orderId: number, status: OrderStatus): Promise<Order>;
  updatePaymentStatus(orderId: number, status: PaymentStatus): Promise<Order>;
  findWithItems(orderId: number): Promise<Order & { items: any[] }>;
  findByDateRange(startDate: Date, endDate: Date): Promise<Order[]>;
}

export class OrderRepository implements IOrderRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: number): Promise<Order | null> {
    try {
      return await this.prisma.order.findUnique({
        where: { id },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          address: true,
          tracking: true,
        },
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async findAll(): Promise<Order[]> {
    try {
      return await this.prisma.order.findMany({
        include: {
          items: true,
          address: true,
          tracking: true,
        },
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async create(data: Omit<Order, "id">): Promise<Order> {
    try {
      return await this.prisma.order.create({
        data,
        include: {
          items: true,
          address: true,
        },
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async update(id: number, data: Partial<Order>): Promise<Order> {
    try {
      return await this.prisma.order.update({
        where: { id },
        data,
        include: {
          items: true,
          address: true,
          tracking: true,
        },
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.prisma.order.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async findByUser(userId: number): Promise<Order[]> {
    try {
      return await this.prisma.order.findMany({
        where: { userId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  shop: true,
                },
              },
            },
          },
          address: true,
          tracking: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async findByShop(shopId: number): Promise<Order[]> {
    try {
      return await this.prisma.order.findMany({
        where: {
          items: {
            some: {
              product: {
                shopId,
              },
            },
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          address: true,
          tracking: true,
        },
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async findBySeller(sellerId: number): Promise<Order[]> {
    try {
      return await this.prisma.order.findMany({
        where: {
          items: {
            some: {
              product: {
                sellerId,
              },
            },
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          address: true,
          tracking: true,
        },
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateStatus(orderId: number, status: OrderStatus): Promise<Order> {
    try {
      return await this.prisma.order.update({
        where: { id: orderId },
        data: { status },
        include: {
          items: true,
          tracking: true,
        },
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updatePaymentStatus(
    orderId: number,
    status: PaymentStatus
  ): Promise<Order> {
    try {
      return await this.prisma.order.update({
        where: { id: orderId },
        data: { paymentStatus: status },
        include: {
          items: true,
        },
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async findWithItems(orderId: number): Promise<Order & { items: any[] }> {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id: orderId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  shop: true,
                },
              },
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          address: true,
          tracking: true,
        },
      });

      if (!order) {
        throw new NotFoundError("Order not found");
      }

      return order;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Order[]> {
    try {
      return await this.prisma.order.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } catch (error) {
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

    throw new Error("Internal server error");
  }
}
