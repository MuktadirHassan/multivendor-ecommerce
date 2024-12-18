export interface Category {
  id: number;
  name: string;
  description?: string;
  image?: string;
  parentId?: number;
  children?: Category[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  image?: File;
  parentId?: number;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  image?: File;
  parentId?: number;
}
