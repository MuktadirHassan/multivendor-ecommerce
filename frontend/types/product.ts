export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  images: string[];
  categoryId: number;
  shopId: number;
  sellerId: number;
  isActive: boolean;
  rating: number;
  discount: number;
  sku?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCreate {
  name: string;
  description?: string;
  price: number;
  stock?: number;
  categoryId: number;
  shopId: number;
  discount?: number;
  images?: File[];
}

export interface ProductUpdate {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  categoryId?: number;
  isActive?: boolean;
  discount?: number;
  images?: File[];
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  shopId?: number;
  searchQuery?: string;
  inStock?: boolean;
  rating?: number;
  sortBy?: "price" | "rating" | "createdAt";
  sortOrder?: "asc" | "desc";
}
