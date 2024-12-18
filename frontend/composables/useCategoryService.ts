import type { Category } from "~/types/category";

export const useCategoryService = () => {
  const config = useRuntimeConfig();
  const baseUrl = config.public.apiBase;

  const fetchCategories = async (includeSubcategories?: boolean) => {
    try {
      const { data, error } = await useFetch<{
        status: string;
        message: string;
        data: Category[];
      }>(`${baseUrl}/categories`, {
        params: { includeSubcategories },
      });

      if (error.value) throw error.value;
      return data.value;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  };

  const createCategory = async (category: FormData) => {
    try {
      const { data, error } = await useFetch<{
        status: string;
        message: string;
        data: Category;
      }>(`${baseUrl}/categories`, {
        method: "POST",
        body: category,
      });

      if (error.value) throw error.value;
      return data.value;
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  };

  const getCategory = async (id: number) => {
    try {
      const { data, error } = await useFetch<{
        status: string;
        message: string;
        data: Category;
      }>(`${baseUrl}/categories/${id}`);

      if (error.value) throw error.value;
      return data.value;
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error);
      throw error;
    }
  };

  const updateCategory = async (id: number, updates: FormData) => {
    try {
      const { data, error } = await useFetch<{
        status: string;
        message: string;
        data: Category;
      }>(`${baseUrl}/categories/${id}`, {
        method: "PUT",
        body: updates,
      });

      if (error.value) throw error.value;
      return data.value;
    } catch (error) {
      console.error(`Error updating category ${id}:`, error);
      throw error;
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      const { error } = await useFetch(`${baseUrl}/categories/${id}`, {
        method: "DELETE",
      });

      if (error.value) throw error.value;
      return true;
    } catch (error) {
      console.error(`Error deleting category ${id}:`, error);
      throw error;
    }
  };

  const getSubcategories = async (parentId: number) => {
    try {
      const { data, error } = await useFetch<{
        status: string;
        message: string;
        data: Category[];
      }>(`${baseUrl}/categories/${parentId}/subcategories`);

      if (error.value) throw error.value;
      return data.value;
    } catch (error) {
      console.error(
        `Error fetching subcategories for category ${parentId}:`,
        error
      );
      throw error;
    }
  };

  return {
    fetchCategories,
    createCategory,
    getCategory,
    updateCategory,
    deleteCategory,
    getSubcategories,
  };
};
