export interface Review {
  id: number;
  userId: number;
  productId: number;
  shopId: number;
  rating: number;
  comment?: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    name: string;
    avatar?: string;
  };
}

export interface ReviewResponse {
  status: string;
  message: string;
  data: Review | Review[];
}

export interface CreateReviewRequest {
  productId: number;
  rating: number;
  comment?: string;
  images?: File[];
}

export interface UpdateReviewRequest {
  rating?: number;
  comment?: string;
  images?: File[];
}

export interface ReviewFilters {
  productId?: number;
  shopId?: number;
  userId?: number;
  rating?: number;
  sortBy?: "createdAt" | "rating";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}
