import { Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import sendApiResponse from "../utils/sendApiResponse";
import { SearchService } from "../services/ai-search.service";

export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  search = catchAsync(async (req: Request, res: Response) => {
    const { q } = req.query;
    const filters = req.body;

    const results = await this.searchService.searchProducts(
      q as string,
      filters
    );
    sendApiResponse(res, 200, "Search results retrieved successfully", results);
  });

  getRecommendations = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const recommendations = await this.searchService.getRecommendations(userId);
    sendApiResponse(
      res,
      200,
      "Recommendations retrieved successfully",
      recommendations
    );
  });
}
