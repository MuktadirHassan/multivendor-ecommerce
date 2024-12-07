import { PrismaClient, User, Role } from "@prisma/client";
import { IUserRepository } from "./user.repository";

export interface RegisterDTO {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role?: Role;
}

export interface IAuthRepository {
  register(data: RegisterDTO): Promise<User>;
  login(email: string, password: string): Promise<User | null>;
  findById(id: number): Promise<User | null>;
}

export class AuthRepository implements IAuthRepository {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly userRepository: IUserRepository
  ) {}

  async register(data: RegisterDTO): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error("Email already exists");
    }

    return this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password, // Note: Password should be hashed in service layer
        name: data.name,
        phone: data.phone,
        role: data.role || Role.USER,
      },
    });
  }

  async login(email: string, password: string): Promise<User | null> {
    return this.userRepository.verifyCredentials(email, password);
  }

  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }
}
