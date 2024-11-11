import { Address } from "@prisma/client";
import { BaseRepository } from "../types/repository";

export interface IAddressRepository extends BaseRepository<Address> {
  findByUser(userId: number): Promise<Address[]>;
  setDefaultAddress(userId: number, addressId: number): Promise<Address>;
  findDefaultAddress(userId: number): Promise<Address | null>;
}
