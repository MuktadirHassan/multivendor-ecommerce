import type { User, LoginRequest, RegisterRequest } from "~/types/user";
import type { Address } from "~/types/address";

export const useUserService = () => {
  const config = useRuntimeConfig();
  const baseUrl = config.public.apiBase;

  const login = async (credentials: LoginRequest) => {
    try {
      const { data, error } = await useFetch<{
        status: string;
        message: string;
        data: { token: string; user: User };
      }>(`${baseUrl}/auth/login`, {
        method: "POST",
        body: credentials,
      });

      if (error.value) throw error.value;
      return data.value;
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  };

  const register = async (userData: RegisterRequest) => {
    try {
      const { data, error } = await useFetch<{
        status: string;
        message: string;
        data: { token: string; user: User };
      }>(`${baseUrl}/auth/register`, {
        method: "POST",
        body: userData,
      });

      if (error.value) throw error.value;
      return data.value;
    } catch (error) {
      console.error("Error during registration:", error);
      throw error;
    }
  };

  const getCurrentUser = async () => {
    try {
      const { data, error } = await useFetch<{
        status: string;
        message: string;
        data: User;
      }>(`${baseUrl}/auth/me`);

      if (error.value) throw error.value;
      return data.value;
    } catch (error) {
      console.error("Error fetching current user:", error);
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    try {
      const formData = new FormData();
      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined && key !== "avatar") {
          formData.append(key, value !== null ? value.toString() : "");
        }
      });

      if (updates.avatar) {
        formData.append("avatar", updates.avatar);
      }

      const { data, error } = await useFetch<{
        status: string;
        message: string;
        data: User;
      }>(`${baseUrl}/auth/me`, {
        method: "PUT",
        body: formData,
      });

      if (error.value) throw error.value;
      return data.value;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    try {
      const { data, error } = await useFetch<{
        status: string;
        message: string;
      }>(`${baseUrl}/auth/password`, {
        method: "PUT",
        body: { currentPassword, newPassword },
      });

      if (error.value) throw error.value;
      return data.value;
    } catch (error) {
      console.error("Error changing password:", error);
      throw error;
    }
  };

  const getAddresses = async () => {
    try {
      const { data, error } = await useFetch<{
        status: string;
        message: string;
        data: Address[];
      }>(`${baseUrl}/addresses`);

      if (error.value) throw error.value;
      return data.value;
    } catch (error) {
      console.error("Error fetching addresses:", error);
      throw error;
    }
  };

  const addAddress = async (address: Omit<Address, "id" | "userId">) => {
    try {
      const { data, error } = await useFetch<{
        status: string;
        message: string;
        data: Address;
      }>(`${baseUrl}/addresses`, {
        method: "POST",
        body: address,
      });

      if (error.value) throw error.value;
      return data.value;
    } catch (error) {
      console.error("Error adding address:", error);
      throw error;
    }
  };

  const updateAddress = async (id: number, updates: Partial<Address>) => {
    try {
      const { data, error } = await useFetch<{
        status: string;
        message: string;
        data: Address;
      }>(`${baseUrl}/addresses/${id}`, {
        method: "PUT",
        body: updates,
      });

      if (error.value) throw error.value;
      return data.value;
    } catch (error) {
      console.error(`Error updating address ${id}:`, error);
      throw error;
    }
  };

  const deleteAddress = async (id: number) => {
    try {
      const { error } = await useFetch(`${baseUrl}/addresses/${id}`, {
        method: "DELETE",
      });

      if (error.value) throw error.value;
      return true;
    } catch (error) {
      console.error(`Error deleting address ${id}:`, error);
      throw error;
    }
  };

  const setDefaultAddress = async (id: number) => {
    try {
      const { data, error } = await useFetch<{
        status: string;
        message: string;
        data: Address;
      }>(`${baseUrl}/addresses/${id}/default`, {
        method: "PATCH",
      });

      if (error.value) throw error.value;
      return data.value;
    } catch (error) {
      console.error(`Error setting default address ${id}:`, error);
      throw error;
    }
  };

  return {
    login,
    register,
    getCurrentUser,
    updateProfile,
    changePassword,
    getAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  };
};
