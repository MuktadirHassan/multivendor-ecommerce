import { Address, PrismaClient, Prisma } from "@prisma/client";
import { BaseRepository } from "../types/repository";
import {
  NotFoundError,
  ValidationError,
  DatabaseError,
} from "../utils/appError";

export interface IAddressRepository extends BaseRepository<Address> {
  findByUser(userId: number): Promise<Address[]>;
  setDefaultAddress(userId: number, addressId: number): Promise<Address>;
  findDefaultAddress(userId: number): Promise<Address | null>;
}

export class AddressRepository implements IAddressRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: number): Promise<Address | null> {
    try {
      return await this.prisma.address.findUnique({
        where: { id },
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async findAll(): Promise<Address[]> {
    try {
      return await this.prisma.address.findMany();
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async create(data: Omit<Address, "id">): Promise<Address> {
    try {
      // If setting as default, unset any existing default address
      if (data.isDefault) {
        await this.prisma.address.updateMany({
          where: { userId: data.userId, isDefault: true },
          data: { isDefault: false },
        });
      }

      return await this.prisma.address.create({ data });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async update(id: number, data: Partial<Address>): Promise<Address> {
    try {
      const address = await this.findById(id);
      if (!address) {
        throw new NotFoundError("Address not found");
      }

      // If setting as default, unset any existing default address
      if (data.isDefault) {
        await this.prisma.address.updateMany({
          where: {
            userId: address.userId,
            isDefault: true,
            id: { not: id },
          },
          data: { isDefault: false },
        });
      }

      return await this.prisma.address.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const address = await this.prisma.address.delete({
        where: { id },
      });
      return !!address;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new NotFoundError("Address not found");
        }
      }
      throw this.handleError(error);
    }
  }

  async findByUser(userId: number): Promise<Address[]> {
    try {
      return await this.prisma.address.findMany({
        where: { userId },
        orderBy: { isDefault: "desc" },
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async setDefaultAddress(userId: number, addressId: number): Promise<Address> {
    try {
      // Verify address belongs to user
      const address = await this.prisma.address.findFirst({
        where: { id: addressId, userId },
      });

      if (!address) {
        throw new NotFoundError("Address not found");
      }

      // Transaction to update addresses
      return await this.prisma.$transaction(async (tx) => {
        // Unset current default
        await tx.address.updateMany({
          where: { userId, isDefault: true },
          data: { isDefault: false },
        });

        // Set new default
        return tx.address.update({
          where: { id: addressId },
          data: { isDefault: true },
        });
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async findDefaultAddress(userId: number): Promise<Address | null> {
    try {
      return await this.prisma.address.findFirst({
        where: { userId, isDefault: true },
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2002":
          throw new ValidationError("Unique constraint violation");
        case "P2014":
          throw new ValidationError("Invalid ID");
        case "P2025":
          throw new NotFoundError("Record not found");
        default:
          throw new DatabaseError(`Database error: ${error.message}`);
      }
    }

    if (error instanceof ValidationError || error instanceof NotFoundError) {
      throw error;
    }

    throw new DatabaseError("Internal server error");
  }
}
