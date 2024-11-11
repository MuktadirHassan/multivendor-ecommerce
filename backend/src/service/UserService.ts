// services/UserService.ts
import { IUserRepository } from "../repositories/UserRepository";
import { IUser } from "../model/User";

export class UserService {
  constructor(private userRepository: IUserRepository) {}

  async getAllUsers(): Promise<IUser[]> {
    return this.userRepository.findAll();
  }

  async getUserById(id: number): Promise<IUser | null> {
    return this.userRepository.findById(id);
  }

  async createUser(user: IUser): Promise<IUser> {
    return this.userRepository.create(user);
  }

  async updateUser(id: number, user: IUser): Promise<IUser | null> {
    return this.userRepository.update(user);
  }

  async deleteUser(id: number): Promise<void> {
    return this.userRepository.delete(id);
  }
}
