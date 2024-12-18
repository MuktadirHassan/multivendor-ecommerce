import type {
  Product,
  ProductCreate,
  ProductFilters,
  ProductUpdate,
} from "~/types/product";

export const useProductService = () => {
  const config = useRuntimeConfig();
  const baseUrl = config.public.apiBase;

  const fetchProducts = async (filters?: ProductFilters) => {
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
        data: Product[];
      }>(`${baseUrl}/products`, {
        params: queryParams,
      });

      if (error.value) {
        throw error.value;
      }
      return data.value;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  };

  const createProduct = async (product: ProductCreate) => {
    try {
      const formData = new FormData();

      // Add basic product data
      Object.entries(product).forEach(([key, value]) => {
        if (value !== undefined && key !== "images") {
          formData.append(key, value.toString());
        }
      });

      // Add images if present
      if (product.images) {
        product.images.forEach((image) => {
          formData.append("images", image);
        });
      }

      const { data, error } = await useFetch<{
        status: string;
        message: string;
        data: Product;
      }>(`${baseUrl}/products`, {
        method: "POST",
        body: formData,
      });

      if (error.value) {
        throw error.value;
      }

      return data.value;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  };

  const getProduct = async (id: number) => {
    try {
      const { data, error } = await useFetch<{
        status: string;
        message: string;
        data: Product;
      }>(`${baseUrl}/products/${id}`);

      if (error.value) {
        throw error.value;
      }

      return data.value;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  };

  const updateProduct = async (id: number, updates: ProductUpdate) => {
    try {
      const formData = new FormData();

      // Add update data
      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined && key !== "images") {
          formData.append(key, value.toString());
        }
      });

      // Add images if present
      if (updates.images) {
        updates.images.forEach((image) => {
          formData.append("images", image);
        });
      }

      const { data, error } = await useFetch<{
        status: string;
        message: string;
        data: Product;
      }>(`${baseUrl}/products/${id}`, {
        method: "PATCH",
        body: formData,
      });

      if (error.value) {
        throw error.value;
      }

      return data.value;
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error;
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      const { error } = await useFetch(`${baseUrl}/products/${id}`, {
        method: "DELETE",
      });

      if (error.value) {
        throw error.value;
      }

      return true;
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw error;
    }
  };

  const getShopProducts = async (shopId: number) => {
    try {
      const { data, error } = await useFetch<{
        status: string;
        message: string;
        data: Product[];
      }>(`${baseUrl}/products/shop/${shopId}`);

      if (error.value) {
        throw error.value;
      }

      return data.value;
    } catch (error) {
      console.error(`Error fetching shop products for shop ${shopId}:`, error);
      throw error;
    }
  };

  const getCategoryProducts = async (categoryId: number) => {
    try {
      const { data, error } = await useFetch<{
        status: string;
        message: string;
        data: Product[];
      }>(`${baseUrl}/products/category/${categoryId}`);

      if (error.value) {
        throw error.value;
      }

      return data.value;
    } catch (error) {
      console.error(
        `Error fetching category products for category ${categoryId}:`,
        error
      );
      throw error;
    }
  };

  const searchProducts = async (query: string) => {
    try {
      const { data, error } = await useFetch<{
        status: string;
        message: string;
        data: Product[];
      }>(`${baseUrl}/products/search`, {
        params: { q: query },
      });

      if (error.value) {
        throw error.value;
      }

      return data.value;
    } catch (error) {
      console.error("Error searching products:", error);
      throw error;
    }
  };

  const getFeaturedProducts = async () => {
    try {
      const { data, error } = await useFetch<{
        status: string;
        message: string;
        data: Product[];
      }>(`${baseUrl}/products/featured`);

      if (error.value) {
        throw error.value;
      }

      return data.value;
    } catch (error) {
      console.error("Error fetching featured products:", error);
      throw error;
    }
  };

  const getAiSearch = async (query: string) => {
    try {
      const { data, error } = await useFetch<{
        status: string;
        message: string;
        data: Product[];
      }>(`${baseUrl}/search`, {
        params: { q: query },
      });

      if (error.value) {
        throw error.value;
      }

      return data.value;
    } catch (error) {
      console.error("Error fetching AI search results:", error);
      throw error;
    }
  };

  return {
    fetchProducts,
    createProduct,
    getProduct,
    updateProduct,
    deleteProduct,
    getShopProducts,
    getCategoryProducts,
    searchProducts,
    getFeaturedProducts,
    getAiSearch,
  };
};
