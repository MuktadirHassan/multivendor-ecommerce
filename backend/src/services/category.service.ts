import { Category } from "@prisma/client";
import { ICategoryRepository } from "../repositories/category.repository";
import { NotFoundError, ValidationError } from "../utils/appError";
import { uploadImage, deleteImage } from "../utils/imageUpload";

export class CategoryService {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async getAllCategories(includeSubcategories = false): Promise<Category[]> {
    return includeSubcategories
      ? await this.categoryRepository.findAll()
      : await this.categoryRepository.findRootCategories();
  }

  async getCategoryById(id: number): Promise<Category> {
    const category = await this.categoryRepository.findById(id);
    if (!category) throw new NotFoundError("Category not found");
    return category;
  }

  async createCategory(data: CreateCategoryDTO): Promise<Category> {
    let imageUrl: string | undefined;
    if (data.imageFile) {
      imageUrl = await this.handleImageUpload(data.imageFile);
    }

    return await this.categoryRepository.create({
      name: data.name,
      description: data.description || null,
      parentId: data.parentId || null,
      image: imageUrl || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async updateCategory(id: number, data: UpdateCategoryDTO): Promise<Category> {
    const existingCategory = await this.getCategoryById(id);
    let imageUrl = data.imageUrl;

    if (data.imageFile) {
      if (existingCategory.image) {
        await deleteImage(existingCategory.image);
      }
      imageUrl = await this.handleImageUpload(data.imageFile);
    }

    return await this.categoryRepository.update(id, {
      ...data,
      image: imageUrl,
    });
  }

  async deleteCategory(id: number): Promise<boolean> {
    const category = await this.getCategoryById(id);

    if (category.image) {
      await deleteImage(category.image);
    }

    return await this.categoryRepository.delete(id);
  }

  async getSubcategories(categoryId: number): Promise<Category[]> {
    const exists = await this.categoryRepository.findById(categoryId);
    if (!exists) throw new NotFoundError("Parent category not found");
    return await this.categoryRepository.findByParentId(categoryId);
  }

  private async handleImageUpload(image: Express.Multer.File): Promise<string> {
    try {
      return await uploadImage(image);
    } catch (error) {
      throw new ValidationError("Failed to upload image");
    }
  }
}

interface CategoryImageData {
  imageFile?: Express.Multer.File;
  imageUrl?: string | null;
}

interface CreateCategoryDTO extends Omit<CategoryImageData, "imageUrl"> {
  name: string;
  description?: string;
  parentId?: number;
}

interface UpdateCategoryDTO extends CategoryImageData {
  name?: string;
  description?: string;
  parentId?: number;
}
