import { Request, Response } from "express";
import { OrderStatus, PaymentStatus } from "@prisma/client";
import { OrderService } from "../services/order.service";
import catchAsync from "../utils/catchAsync";
import sendApiResponse from "../utils/sendApiResponse";
import { ValidationError } from "../utils/appError";

export class OrderController {
  constructor(private orderService: OrderService) {}

  createOrder = catchAsync(async (req: Request, res: Response) => {
    const { addressId, items, paymentMethod } = req.body;
    const userId = req.user!.userId;

    const order = await this.orderService.createOrder({
      userId,
      addressId,
      items,
      paymentMethod,
    });

    sendApiResponse(res, 201, "Order created successfully", order);
  });

  getOrder = catchAsync(async (req: Request, res: Response) => {
    const orderId = parseInt(req.params.id as string);
    const order = await this.orderService.getOrderById(orderId);

    // Check if user has access to this order
    if (req.user!.role !== "ADMIN" && order.userId !== req.user!.userId) {
      throw new ValidationError("Unauthorized access to order");
    }

    sendApiResponse(res, 200, "Order retrieved successfully", order);
  });

  getUserOrders = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const orders = await this.orderService.getUserOrders(userId);
    sendApiResponse(res, 200, "Orders retrieved successfully", orders);
  });

  getShopOrders = catchAsync(async (req: Request, res: Response) => {
    const shopId = parseInt(req.params.shopId as string);
    const orders = await this.orderService.getShopOrders(shopId);
    sendApiResponse(res, 200, "Shop orders retrieved successfully", orders);
  });

  updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
    const orderId = parseInt(req.params.id as string);
    const { status } = req.body;

    if (!Object.values(OrderStatus).includes(status)) {
      throw new ValidationError("Invalid order status");
    }

    const order = await this.orderService.updateOrderStatus(orderId, status);
    sendApiResponse(res, 200, "Order status updated successfully", order);
  });

  updatePaymentStatus = catchAsync(async (req: Request, res: Response) => {
    const orderId = parseInt(req.params.id as string);
    const { status } = req.body;

    if (!Object.values(PaymentStatus).includes(status)) {
      throw new ValidationError("Invalid payment status");
    }

    const order = await this.orderService.updatePaymentStatus(orderId, status);
    sendApiResponse(res, 200, "Payment status updated successfully", order);
  });

  getOrdersByDateRange = catchAsync(async (req: Request, res: Response) => {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      throw new ValidationError("Start date and end date are required");
    }

    const orders = await this.orderService.getOrdersByDateRange(
      new Date(startDate as string),
      new Date(endDate as string)
    );

    sendApiResponse(res, 200, "Orders retrieved successfully", orders);
  });
}
