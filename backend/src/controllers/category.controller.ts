import { Request, Response } from "express";
import { CategoryService } from "../services/category.service";
import sendApiResponse from "../utils/sendApiResponse";
import catchAsync from "../utils/catchAsync";

export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  getAllCategories = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const includeSubcategories = req.query.includeSubcategories === "true";
      const categories = await this.categoryService.getAllCategories(
        includeSubcategories
      );
      sendApiResponse(
        res,
        200,
        "Categories retrieved successfully",
        categories
      );
    }
  );

  getCategoryById = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const category = await this.categoryService.getCategoryById(
        Number(req.params.id)
      );
      sendApiResponse(res, 200, "Category retrieved successfully", category);
    }
  );

  createCategory = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const category = await this.categoryService.createCategory({
        ...req.body,
        image: req.file,
      });
      sendApiResponse(res, 201, "Category created successfully", category);
    }
  );

  updateCategory = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const category = await this.categoryService.updateCategory(
        Number(req.params.id),
        { ...req.body, image: req.file }
      );
      sendApiResponse(res, 200, "Category updated successfully", category);
    }
  );

  deleteCategory = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      await this.categoryService.deleteCategory(Number(req.params.id));
      sendApiResponse(res, 204, "Category deleted successfully");
    }
  );

  getSubcategories = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
      const subcategories = await this.categoryService.getSubcategories(
        Number(req.params.id)
      );
      sendApiResponse(
        res,
        200,
        "Subcategories retrieved successfully",
        subcategories
      );
    }
  );
}
