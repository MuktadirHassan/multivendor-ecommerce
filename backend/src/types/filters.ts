export interface ProductFilters {
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  shopId?: number;
  searchQuery?: string;
  inStock?: boolean;
  rating?: number;
  sortBy?: "price" | "rating" | "createdAt";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface ReviewFilters {
  rating?: number;
  sortBy?: "rating" | "createdAt";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}
