import { IUser } from "../model/User";
import { IUserRepository } from "../repository/UserRepository";

export class UserRepositoryImpl implements IUserRepository {
  findAll(): Promise<IUser[]> {
    throw new Error("Method not implemented.");
  }
  findById(id: number): Promise<IUser | null> {
    throw new Error("Method not implemented.");
  }
  findByEmail(email: string): Promise<IUser | null> {
    throw new Error("Method not implemented.");
  }
  create(user: IUser): Promise<IUser> {
    throw new Error("Method not implemented.");
  }
  update(user: IUser): Promise<IUser> {
    throw new Error("Method not implemented.");
  }
  delete(id: number): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
