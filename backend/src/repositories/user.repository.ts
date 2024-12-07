import { User, Role, Address, PrismaClient } from "@prisma/client";
import { BaseRepository } from "../types/repository";
import bcrypt from "bcryptjs";

export interface IUserRepository extends BaseRepository<User> {
  findByEmail(email: string): Promise<User | null>;
  findBySellerId(sellerId: number): Promise<User | null>;
  updateRole(userId: number, role: Role): Promise<User>;
  getAddresses(userId: number): Promise<Address[]>;
  verifyCredentials(email: string, password: string): Promise<User | null>;
}

export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findBySellerId(sellerId: number): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        id: sellerId,
        role: Role.SELLER,
      },
    });
  }

  async create(data: Partial<User>): Promise<User> {
    return this.prisma.user.create({
      data: data as User,
    });
  }

  async update(id: number, data: Partial<User>): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<boolean> {
    const deleted = this.prisma.user.delete({
      where: { id },
    });

    if (!deleted) return false;
    return true;
  }

  async updateRole(userId: number, role: Role): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { role },
    });
  }

  async getAddresses(userId: number): Promise<Address[]> {
    return this.prisma.address.findMany({
      where: { userId },
    });
  }

  async verifyCredentials(
    email: string,
    password: string
  ): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }
}
