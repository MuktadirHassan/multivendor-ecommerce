import type { Address } from "~/types/address";

export const useAddressService = () => {
  const config = useRuntimeConfig();
  const baseUrl = config.public.apiBase;

  const fetchAddresses = async () => {
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

  const getAddress = async (id: number) => {
    try {
      const { data, error } = await useFetch<{
        status: string;
        message: string;
        data: Address;
      }>(`${baseUrl}/addresses/${id}`);

      if (error.value) throw error.value;
      return data.value;
    } catch (error) {
      console.error(`Error fetching address ${id}:`, error);
      throw error;
    }
  };

  const createAddress = async (addressData: Omit<Address, "id" | "userId">) => {
    try {
      const { data, error } = await useFetch<{
        status: string;
        message: string;
        data: Address;
      }>(`${baseUrl}/addresses`, {
        method: "POST",
        body: addressData,
      });

      if (error.value) throw error.value;
      return data.value;
    } catch (error) {
      console.error("Error creating address:", error);
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

  const getDefaultAddress = async () => {
    try {
      const { data, error } = await useFetch<{
        status: string;
        message: string;
        data: Address;
      }>(`${baseUrl}/addresses/default`);

      if (error.value) throw error.value;
      return data.value;
    } catch (error) {
      console.error("Error fetching default address:", error);
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
    fetchAddresses,
    getAddress,
    createAddress,
    updateAddress,
    deleteAddress,
    getDefaultAddress,
    setDefaultAddress,
  };
};
