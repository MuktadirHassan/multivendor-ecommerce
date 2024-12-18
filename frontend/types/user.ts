// User related types
export type Role = "USER" | "ADMIN" | "SELLER";

export interface User {
  id: number;
  email: string;
  name: string | null;
  role: Role;
  phone: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role?: Role;
}

export interface AuthResponse {
  token: string;
  user: User;
}
