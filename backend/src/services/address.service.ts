import { Address } from "@prisma/client";
import { IAddressRepository } from "../repositories/address.repository";
import { NotFoundError, ValidationError } from "../utils/appError";

export class AddressService {
  constructor(private readonly addressRepository: IAddressRepository) {}

  async getAllAddresses(userId: number): Promise<Address[]> {
    return this.addressRepository.findByUser(userId);
  }

  async getAddressById(id: number, userId: number): Promise<Address> {
    const address = await this.addressRepository.findById(id);

    if (!address) {
      throw new NotFoundError("Address not found");
    }

    if (address.userId !== userId) {
      throw new ValidationError("Unauthorized access to address");
    }

    return address;
  }

  async createAddress(data: Omit<Address, "id">): Promise<Address> {
    return this.addressRepository.create(data);
  }

  async updateAddress(
    id: number,
    data: Partial<Address>,
    userId: number
  ): Promise<Address> {
    const address = await this.getAddressById(id, userId);

    return this.addressRepository.update(id, {
      ...data,
      userId: address.userId, // Ensure userId cannot be changed
    });
  }

  async deleteAddress(id: number, userId: number): Promise<boolean> {
    await this.getAddressById(id, userId);
    return this.addressRepository.delete(id);
  }

  async setDefaultAddress(userId: number, addressId: number): Promise<Address> {
    await this.getAddressById(addressId, userId);
    return this.addressRepository.setDefaultAddress(userId, addressId);
  }

  async getDefaultAddress(userId: number): Promise<Address | null> {
    return this.addressRepository.findDefaultAddress(userId);
  }
}
