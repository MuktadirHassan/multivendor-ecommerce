import type {
  Review,
  CreateReviewRequest,
  ReviewFilters,
} from "~/types/review";

export const useReviewService = () => {
  const config = useRuntimeConfig();
  const baseUrl = config.public.apiBase;

  const fetchReviews = async (filters?: ReviewFilters) => {
    try {
      const queryParams = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            queryParams.append(key, value.toString());
          }
        });
      }

      const { data, error } = await useFetch<{
        status: string;
        message: string;
        data: Review[];
      }>(`${baseUrl}/reviews`, {
        params: queryParams,
      });

      if (error.value) throw error.value;
      return data.value;
    } catch (error) {
      console.error("Error fetching reviews:", error);
      throw error;
    }
  };

  const createReview = async (review: CreateReviewRequest) => {
    try {
      const formData = new FormData();
      Object.entries(review).forEach(([key, value]) => {
        if (value !== undefined && key !== "images") {
          formData.append(key, value.toString());
        }
      });

      if (review.images) {
        review.images.forEach((image) => {
          formData.append("images", image);
        });
      }

      const { data, error } = await useFetch<{
        status: string;
        message: string;
        data: Review;
      }>(`${baseUrl}/reviews`, {
        method: "POST",
        body: formData,
      });

      if (error.value) throw error.value;
      return data.value;
    } catch (error) {
      console.error("Error creating review:", error);
      throw error;
    }
  };

  const getReview = async (id: number) => {
    try {
      const { data, error } = await useFetch<{
        status: string;
        message: string;
        data: Review;
      }>(`${baseUrl}/reviews/${id}`);

      if (error.value) throw error.value;
      return data.value;
    } catch (error) {
      console.error(`Error fetching review ${id}:`, error);
      throw error;
    }
  };

  const updateReview = async (
    id: number,
    updates: Partial<CreateReviewRequest>
  ) => {
    try {
      const formData = new FormData();
      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined && key !== "images") {
          formData.append(key, value.toString());
        }
      });

      if (updates.images) {
        updates.images.forEach((image) => {
          formData.append("images", image);
        });
      }

      const { data, error } = await useFetch<{
        status: string;
        message: string;
        data: Review;
      }>(`${baseUrl}/reviews/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (error.value) throw error.value;
      return data.value;
    } catch (error) {
      console.error(`Error updating review ${id}:`, error);
      throw error;
    }
  };

  const deleteReview = async (id: number) => {
    try {
      const { error } = await useFetch(`${baseUrl}/reviews/${id}`, {
        method: "DELETE",
      });

      if (error.value) throw error.value;
      return true;
    } catch (error) {
      console.error(`Error deleting review ${id}:`, error);
      throw error;
    }
  };

  const getProductReviews = async (productId: number) => {
    try {
      const { data, error } = await useFetch<{
        status: string;
        message: string;
        data: Review[];
      }>(`${baseUrl}/reviews/product/${productId}`);

      if (error.value) throw error.value;
      return data.value;
    } catch (error) {
      console.error(
        `Error fetching product reviews for product ${productId}:`,
        error
      );
      throw error;
    }
  };

  const getShopReviews = async (shopId: number) => {
    try {
      const { data, error } = await useFetch<{
        status: string;
        message: string;
        data: Review[];
      }>(`${baseUrl}/reviews/shop/${shopId}`);

      if (error.value) throw error.value;
      return data.value;
    } catch (error) {
      console.error(`Error fetching shop reviews for shop ${shopId}:`, error);
      throw error;
    }
  };

  return {
    fetchReviews,
    createReview,
    getReview,
    updateReview,
    deleteReview,
    getProductReviews,
    getShopReviews,
  };
};
