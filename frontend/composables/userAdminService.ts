// composables/useAdminUserService.ts
import type { User, Role } from "~/types/user";
export const auth_token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE0OSwicm9sZSI6IkFETUlOIiwiaWF0IjoxNzM0NTY3NzYxLCJleHAiOjE3MzQ2NTQxNjF9.EjaET1MdSaIKyTn0sCXhgKbdh5_TabSHI9at8tcOV1Q";
export const useAdminUserService = () => {
  const config = useRuntimeConfig();
  const baseUrl = config.public.apiBase;

  const getAllUsers = async (page = 1, limit = 10) => {
    const { data, error } = await useFetch<{
      status: string;
      message: string;
      data: User[];
      total: number;
    }>(`${baseUrl}/users`, {
      params: { page, limit },
      headers: {
        Authorization: `Bearer ${auth_token}`,
      },
    });

    if (error.value) throw error.value;
    return data.value;
  };

  const updateUser = async (id: number, updates: Partial<User>) => {
    const { data, error } = await useFetch<{
      status: string;
      message: string;
      data: User;
    }>(`${baseUrl}/users/${id}`, {
      method: "PUT",
      body: updates,
      headers: {
        Authorization: `Bearer ${auth_token}`,
      },
    });

    if (error.value) throw error.value;
    return data.value;
  };

  const deleteUser = async (id: number) => {
    const { error } = await useFetch(`${baseUrl}/admin/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${auth_token}`,
      },
    });

    if (error.value) throw error.value;
    return true;
  };

  const updateUserRole = async (id: number, role: Role) => {
    const { data, error } = await useFetch<{
      status: string;
      message: string;
      data: User;
    }>(`${baseUrl}/users/${id}/role`, {
      method: "PATCH",
      body: { role },
      headers: {
        Authorization: `Bearer ${auth_token}`,
      },
    });

    if (error.value) throw error.value;
    return data.value;
  };

  return {
    getAllUsers,
    updateUser,
    deleteUser,
    updateUserRole,
  };
};
