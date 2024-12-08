import { Request, Response } from "express";
import { ReviewService } from "../services/review.service";
import { ReviewFilters } from "../types/filters";
import catchAsync from "../utils/catchAsync";
import sendApiResponse from "../utils/sendApiResponse";
import { ValidationError } from "../utils/appError";

export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  createReview = catchAsync(async (req: Request, res: Response) => {
    const { productId, rating, comment, images } = req.body;

    if (!productId) throw new ValidationError("Product ID is required");
    if (!rating) throw new ValidationError("Rating is required");
    if (rating < 1 || rating > 5)
      throw new ValidationError("Rating must be between 1 and 5");

    const review = await this.reviewService.createReview(req.user!.userId, {
      productId,
      rating,
      comment,
      images,
    });

    sendApiResponse(res, 201, "Review created successfully", review);
  });

  updateReview = catchAsync(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) throw new ValidationError("Invalid review ID");

    const { rating, comment, images } = req.body;
    if (rating && (rating < 1 || rating > 5)) {
      throw new ValidationError("Rating must be between 1 and 5");
    }

    const review = await this.reviewService.updateReview(req.user!.userId, id, {
      rating,
      comment,
      images,
    });

    sendApiResponse(res, 200, "Review updated successfully", review);
  });

  deleteReview = catchAsync(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) throw new ValidationError("Invalid review ID");

    await this.reviewService.deleteReview(req.user!.userId, id);
    sendApiResponse(res, 204, "Review deleted successfully");
  });

  getReview = catchAsync(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) throw new ValidationError("Invalid review ID");

    const review = await this.reviewService.getReview(id);
    sendApiResponse(res, 200, "Review retrieved successfully", review);
  });

  getReviews = catchAsync(async (req: Request, res: Response) => {
    const filters: ReviewFilters = {
      rating: req.query.rating ? Number(req.query.rating) : undefined,
      sortBy: req.query.sortBy as "rating" | "createdAt",
      sortOrder: req.query.sortOrder as "asc" | "desc",
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 10,
    };

    if (filters.rating && (filters.rating < 1 || filters.rating > 5)) {
      throw new ValidationError("Rating filter must be between 1 and 5");
    }

    const reviews = await this.reviewService.getReviews(filters);
    sendApiResponse(res, 200, "Reviews retrieved successfully", reviews);
  });

  getProductReviews = catchAsync(async (req: Request, res: Response) => {
    const productId = parseInt(req.params.productId as string);
    if (isNaN(productId)) throw new ValidationError("Invalid product ID");

    const reviews = await this.reviewService.getProductReviews(productId);
    sendApiResponse(
      res,
      200,
      "Product reviews retrieved successfully",
      reviews
    );
  });

  getShopReviews = catchAsync(async (req: Request, res: Response) => {
    const shopId = parseInt(req.params.shopId as string);
    if (isNaN(shopId)) throw new ValidationError("Invalid shop ID");

    const reviews = await this.reviewService.getShopReviews(shopId);
    sendApiResponse(res, 200, "Shop reviews retrieved successfully", reviews);
  });
}
