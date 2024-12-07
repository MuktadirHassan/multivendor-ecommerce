import { User, Role } from "@prisma/client";
import { IAuthRepository, RegisterDTO } from "../repositories/auth.repository";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export interface AuthTokenPayload {
  userId: number;
  role: Role;
}

export interface LoginResponse {
  token: string;
  user: Omit<User, "password">;
}

export class AuthService {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly jwtSecret: string = process.env.JWT_SECRET ||
      "your-secret-key"
  ) {}

  private generateToken(payload: AuthTokenPayload): string {
    return jwt.sign(payload, this.jwtSecret, { expiresIn: "24h" });
  }

  private excludePassword(user: User): Omit<User, "password"> {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async register(data: RegisterDTO): Promise<LoginResponse> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.authRepository.register({
      ...data,
      password: hashedPassword,
    });

    const token = this.generateToken({
      userId: user.id,
      role: user.role,
    });

    return {
      token,
      user: this.excludePassword(user),
    };
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const user = await this.authRepository.login(email, password);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const token = this.generateToken({
      userId: user.id,
      role: user.role,
    });

    return {
      token,
      user: this.excludePassword(user),
    };
  }

  async getCurrentUser(userId: number): Promise<Omit<User, "password">> {
    const user = await this.authRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return this.excludePassword(user);
  }

  verifyToken(token: string): AuthTokenPayload {
    try {
      return jwt.verify(token, this.jwtSecret) as AuthTokenPayload;
    } catch (error) {
      throw new Error("Invalid token");
    }
  }
}
