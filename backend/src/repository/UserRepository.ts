import { IUser } from "../model/User";

export interface IUserRepository {
  findAll(): Promise<IUser[]>;
  findById(id: number): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  create(user: IUser): Promise<IUser>;
  update(user: IUser): Promise<IUser>;
  delete(id: number): Promise<void>;
}
