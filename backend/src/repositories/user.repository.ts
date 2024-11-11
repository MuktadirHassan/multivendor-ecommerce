import { User, Role, Address } from "@prisma/client";
import { BaseRepository } from "../types/repository";

export interface IUserRepository extends BaseRepository<User> {
  findByEmail(email: string): Promise<User | null>;
  findBySellerId(sellerId: number): Promise<User | null>;
  updateRole(userId: number, role: Role): Promise<User>;
  getAddresses(userId: number): Promise<Address[]>;
  verifyCredentials(email: string, password: string): Promise<User | null>;
}
